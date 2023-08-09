
import type {
	IConnection,
	IConnections,
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import type { OptionsWithUri } from 'request';
import { includedPathConfig, NodePosition } from './types';

/**
 * A custom API request function to be used with the resourceLocator lookup queries.
 */
export async function getWorkflow(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	workflowId: string,
): Promise<IDataObject> {

	type N8nApiCredentials = {
		apiKey: string;
		baseUrl: string;
	};

	const credentials = (await this.getCredentials('n8nApi')) as N8nApiCredentials;
	const baseUrl = credentials.baseUrl;

	const options: OptionsWithUri = {
		uri: `${baseUrl.replace(new RegExp('/$'), '')}/workflows/${workflowId}`,
		json: true,
	};

	try {
		return await this.helpers.requestWithAuthentication.call(this, 'n8nApi', options);
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function generateSubworkflow(workflow:IDataObject, thisNode:string, clearDataAfterProcessing = false){
	const arrayOfPaths = await getPaths(workflow) as IDataObject[];
	const includedPaths = await getIncludedPaths(arrayOfPaths, thisNode, clearDataAfterProcessing) as IDataObject[];
	const includedNodes = await getIncludedNodes(workflow,includedPaths, thisNode);
	const includedConnections = await getincludedConnections(includedPaths, thisNode) as IDataObject;

	// Add Start node so it can be executed in a subworkflow
	includedNodes.push(await getStartNode(includedNodes[0]));

	// Add End Node to clear data before returning
	if(clearDataAfterProcessing){
		includedNodes.push(await getEndNode(includedNodes));
	}

	return {nodes:includedNodes,connections:includedConnections};
}

export async function getPaths(workflow:IDataObject){
	const connections = workflow.connections as IDataObject;
	const arrayOfPaths = [] as IDataObject[];

	for (const [key, value] of Object.entries(connections)) {

		for (const [key2, array] of Object.entries(value as IDataObject)) {
			const type = key2;
			const parentArray = array as IDataObject[];
			for (let childArrayIndex = 0; childArrayIndex < parentArray.length; childArrayIndex++) {
				const childArray = parentArray[childArrayIndex] as unknown as IDataObject[];
				for (let objectIndex = 0; objectIndex < childArray.length; objectIndex++) {
					const object = childArray[objectIndex] as IDataObject;
					arrayOfPaths.push({
						type,
						from:key,
						to:object.node,
						parentIndex:childArrayIndex,
						childIndex:objectIndex,
						object,
					});
				}
			}
		}
	}
	return arrayOfPaths;
}

export async function getIncludedPaths(arrayOfPaths:IDataObject[], thisNode:string, clearDataAfterProcessing = false){
	let includedPaths = [] as IDataObject[];
	function checkPath(path:IDataObject){
		if(includedPaths.includes(path)){
		}
		else{
			includedPaths.push(path);
			const pathsToCheck = arrayOfPaths.filter(x=> x.from === path.to);
			for (const pathToCheck of pathsToCheck) {
				checkPath(pathToCheck);
			}
		}
	}
	const startPaths = arrayOfPaths.filter(x=> x.from ===thisNode && x.parentIndex !== '0');
	for (const pathToCheck of startPaths) {
		checkPath(pathToCheck);
	}
	if(clearDataAfterProcessing){
		includedPaths = includedPaths.filter(x=> !(x.from === thisNode && x.parentIndex === '0')) as IDataObject[];
	}
	else{
		includedPaths = includedPaths.filter(x=> !(x.from === thisNode && x.parentIndex === '0') && x.to !== thisNode ) as IDataObject[];
	}
	return includedPaths;
}

export async function getIncludedNodes(workflow:IDataObject,includedPaths:IDataObject[], thisNode:string){
	const nodes = workflow.nodes as IDataObject[];
	const includedNodesList = [...new Set(includedPaths.map(x => x.from).concat(includedPaths.map(x => x.to)))];
	const includedNodes = nodes.filter(x => includedNodesList.includes(x.name) && x.name !== thisNode) as IDataObject[];
	return includedNodes;
}

export async function getincludedConnections(includedPaths:IDataObject[], thisNode:string){

	const includedConnections = {} as IConnections;
	for (let includedPathIndex = 0; includedPathIndex < includedPaths.length; includedPathIndex++) {
		const includedPath = includedPaths[includedPathIndex] as includedPathConfig;
		if(includedPath.from === thisNode){
			includedPath.from = 'Start';
			includedPath.parentIndex = 0;
		}
		if(includedPath.to === thisNode){
			includedPath.to = 'EndClearDataNodeAfterAutomatedSubWorkflow';
			includedPath!.object!.node = 'EndClearDataNodeAfterAutomatedSubWorkflow';

		}
		if(includedConnections[includedPath.from] === undefined){
			includedConnections[includedPath.from]={};
		}

		if(!(includedConnections[includedPath.from][includedPath.type])){
			includedConnections[includedPath.from][includedPath.type] = [[],[],[],[]];
		}
		includedConnections[includedPath.from][includedPath.type][includedPath.parentIndex][includedPath.childIndex] = includedPath.object as unknown as IConnection;

	}
	return includedConnections;
}

export async function getStartNode(firstNode:IDataObject){
	const startNode = {
		"parameters": {},
		"id": "2cd3ce3f-e0c9-4c3b-8be1-25b152ba0f0f",
		"name": "Start",
		"type": "n8n-nodes-base.executeWorkflowTrigger",
		"typeVersion": 1,
	};

	// Add StartNode
	const positionOfStartNode = Object.assign([],firstNode.position) as NodePosition;
	positionOfStartNode[0] = positionOfStartNode[0] - 300;
	const startNodeWithPosition = {...startNode,position:positionOfStartNode};
	return startNodeWithPosition;
}

export async function getEndNode(includedNodes:IDataObject[]){
	// Add End Node to clear data before returning
		const clearDataNode = {
			"parameters": {
				"keepOnlySet": true,
				"options": {},
			},
			"id": "ccca7fef-7b2e-4399-a2d4-9cf3300f515c",
			"name": "EndClearDataNodeAfterAutomatedSubWorkflow",
			"type": "n8n-nodes-base.set",
			"typeVersion": 1,
			"executeOnce": true,
		};
		const maxPosition = includedNodes.reduce((prev, current) => ((prev.position as number) > (current.position as number)) ? prev : current);
		const positionOfEndNode = Object.assign([],maxPosition.position) as NodePosition;
		positionOfEndNode[0] = positionOfEndNode[0] + 300;
		const endNodeWithPosition = {...clearDataNode,position:positionOfEndNode};
		return endNodeWithPosition;
}
