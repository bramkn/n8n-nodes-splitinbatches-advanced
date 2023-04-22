import { IDataObject } from "n8n-workflow"

export type includedPathConfig = {
	type:string,
	from:string,
	to:string,
	parentIndex:number,
	childIndex:number,
	object:IDataObject
}
