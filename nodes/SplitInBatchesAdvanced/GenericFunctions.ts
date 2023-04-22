import type {

	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	INode,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import type { OptionsWithUri } from 'request';
import { includedPathConfig } from './types';

/**
 * A custom API request function to be used with the resourceLocator lookup queries.
 */
export async function getWorkflow(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	workflowId: number
): Promise<any> {

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

export async function generateSubworkflow(workflow:IDataObject,thisNode:string){
	const nodes = workflow.nodes as IDataObject[];
	const connections = workflow.connections as IDataObject;
	const arrayOfPaths = [] as IDataObject[];

	for (const [key, value] of Object.entries(connections)) {

		for (const [key2, array] of Object.entries(value as IDataObject)) {
			const type = key2;
			const parentArray = array as IDataObject[];
			for (let childArrayIndex in parentArray) {
				const childArray = parentArray[childArrayIndex];
				for (let objectIndex in childArray) {
					const object = childArray[objectIndex] as IDataObject;
					arrayOfPaths.push({
						type:type,
						from:key,
						to:object.node,
						parentIndex:childArrayIndex,
						childIndex:objectIndex,
						object:object
					})
				}
			}
		}
	}

	let includedPaths = [] as IDataObject[];
	function checkPath(path:IDataObject){
		console.log(path);
		if(includedPaths.includes(path)){
		 //nothing;
		}
		else{
			includedPaths.push(path);
			const pathsToCheck = arrayOfPaths.filter(x=> x.from === path.to);
			for (let pathToCheck of pathsToCheck) {
				checkPath(pathToCheck);
			}
		}
	}
	const startPaths = arrayOfPaths.filter(x=> x.from ===thisNode && x.parentIndex !== 0);
	console.log(startPaths);
	for (let pathToCheck of startPaths) {
		checkPath(pathToCheck);
	}

	includedPaths = includedPaths.filter(x=> !(x.from === thisNode && x.parentIndex === 0)) as IDataObject[];

	const includedNodesList = [...new Set(includedPaths.map(x => x.from).concat(includedPaths.map(x => x.to)))];

	const includedNodes = nodes.filter(x => includedNodesList.includes(x.name) && x.name !== thisNode) as IDataObject[];

	const includedConnections = {} as any;
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
		includedConnections[includedPath.from][includedPath.type][includedPath.parentIndex][includedPath.childIndex] = includedPath.object;

	}

	const startNode = {
		"parameters": {},
		"id": "2cd3ce3f-e0c9-4c3b-8be1-25b152ba0f0f",
		"name": "Start",
		"type": "n8n-nodes-base.executeWorkflowTrigger",
		"typeVersion": 1,
	};

	const clearDataNode = {
		"parameters": {
			"keepOnlySet": true,
			"options": {}
		},
		"id": "ccca7fef-7b2e-4399-a2d4-9cf3300f515c",
		"name": "EndClearDataNodeAfterAutomatedSubWorkflow",
		"type": "n8n-nodes-base.set",
		"typeVersion": 1,
		"position": [
			1800,
			-460
		],
		"executeOnce": true
	};

	let positionOfStartNode = includedNodes[0].position as any;
	positionOfStartNode[0] = positionOfStartNode[0] - 300;
	const startNodeWithPosition = {...startNode,position:positionOfStartNode};

	let positionOfEndNode = includedNodes[0].position as any;
	positionOfEndNode[0] = positionOfEndNode[0] - 600;
	const endNodeWithPosition = {...clearDataNode,position:positionOfEndNode};

	includedNodes.push(startNodeWithPosition);
	includedNodes.push(endNodeWithPosition);

	return {nodes:includedNodes,connections:includedConnections};
}
