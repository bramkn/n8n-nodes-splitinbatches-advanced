import type {

	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import type { OptionsWithUri } from 'request';

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
