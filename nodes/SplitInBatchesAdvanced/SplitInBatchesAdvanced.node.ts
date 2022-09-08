import { IExecuteFunctions } from 'n8n-core';
import { IDataObject, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';

export class SplitInBatchesAdvanced implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Split In Batches Advanced',
		name: 'splitInBatchesAdvanced',
		icon: 'fa:th-large',
		group: ['organization'],
		version: 1,
		description: 'Split data into batches and iterate over each batch',
		defaults: {
			name: 'SplitInBatches-Advanced',
			color: '#733bde',
		},
		inputs: ['main'],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
		outputs: ['main', 'main'],
		outputNames: ['Loop', 'Done'],
		properties: [
			{
				displayName:
					'You may not need this node — n8n nodes automatically run once for each input item. <a href="https://docs.n8n.io/getting-started/key-concepts/looping.html#using-loops-in-n8n" target="_blank">More info</a>',
				name: 'splitInBatchesNotice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Batch Size',
				name: 'batchSize',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 10,
				description: 'The number of items to return with each call',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Reset',
						name: 'reset',
						type: 'boolean',
						default: false,
						description:
							'Whether the node will be reset and so with the current input-data newly initialized',
					},
					{
						displayName: 'Combine',
						name: 'combine',
						type: 'boolean',
						default: false,
						description:
							'Whether the node will combine all items before outputting to Done',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][] | null> {

		const options = this.getNodeParameter('options', 0, {}) as IDataObject;

		const nodeContext = this.getContext('node');

		// Get the input data and create a new array so that we can remove
		// items without a problem
		const items = this.getInputData().slice();

		const batchSize = this.getNodeParameter('batchSize', 0) as number;

		const returnItems: INodeExecutionData[][] = [[],[]];

		if (nodeContext.items === undefined || options.reset === true) {
			// Is the first time the node runs

			nodeContext.currentRunIndex = 0;
			nodeContext.maxRunIndex = Math.ceil(items.length / batchSize);

			// Get the items which should be returned
			returnItems[0].push.apply(returnItems[0], items.splice(0, batchSize));

			// Set the other items to be saved in the context to return at later runs
			nodeContext.items = items;

			nodeContext.processedItems = [];
		} else {
			// The node has been called before. So return the next batch of items.
			nodeContext.currentRunIndex += 1;
			returnItems[0].push.apply(returnItems[0], nodeContext.items.splice(0, batchSize));

			if(options.combine===true){
				nodeContext.processedItems.push.apply(nodeContext.processedItems,items);
			}
			else{
				nodeContext.processedItems =  items;
			}

		}

		nodeContext.noItemsLeft = nodeContext.items.length === 0;

		if (returnItems[0].length === 0) {
			// No data left to return so stop execution of the branch
			returnItems[1] = nodeContext.processedItems;
			return returnItems;
		}

		returnItems[0].map((item, index) => {
			item.pairedItem = {
				item: index,
			};
		});

		return returnItems;
	}
}
