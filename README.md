# n8n-nodes-splitinbatches-advanced

This is an n8n community node. It gives you an extra output of the split in batches node. 
This path will be taken when the split in batches node is done with its loop of batches. It also gives you the option to combine all the results from batches before continuing on this "Done" path. 

If you want to use this node as a normal split in batches node that is possible, simply don't add an output to the Done path.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Developer

Hi, 

My name is Bram and I am the developer of this node.
I am an independant consultant and expert partner of n8n.
My nodes are free to use for everyone, but please consider [donating](https://donate.stripe.com/3cs5oe7xM6L77Yc5ko) when you use my nodes.
This helps me to build and maintain nodes for everyone to use.

If you are looking for some outside help with n8n, I can of course also offer my services.
* Node Development
* Workflow Development
* Mentoring
* Support

Please contact me @ bram@knitco.nl if you want to make use of my services.

For questions or issues with nodes, please open an issue on Github.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Compatibility

This node was developed and tested with version 0.221.2.

## Usage

![SplitInBatchesAdvanced](https://github.com/bramkn/n8n-nodes-splitinbatches-advanced/blob/master/images/SplitInBatchesAdvanced.png)

The node works the same as the split in batches node. But with some quality of life additions.
* [n8n splitinbatches node docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.splitinbatches/)

The node will continue on the Done path when the batches are finished processing.
The node has the option to combine the data into one list of items, instead of the split runs of items.

![SplitInBatchesAdvancedCombine](https://github.com/bramkn/n8n-nodes-splitinbatches-advanced/blob/master/images/SplitInBatchesAdvancedCombine.png)

The data returned is the data coming into the node after each iteration of the loop.

### v2 functionality
![image](https://user-images.githubusercontent.com/74856333/233983968-e8e65c4e-19e4-4e90-bdbb-8aa4636aa1a8.png)

### max manual batches
When set it will cap the maximum number of batches it will process before sending the data to the Done branch.
This is automatically used when the workflow is ran manually. When running in the background by n8n it will not be used.

### Process Batch in Subworkflow
This will take the workflow present in the split in batch loop and turn it into a subworkflow, this will then be started for each batch in the background.
This will not actually create a subworkflow it will only execute it as if it was a subworkflow.

![image](https://user-images.githubusercontent.com/74856333/233984675-21d75e1a-d20b-426a-96f2-0fd754bc435a.png)

![image](https://user-images.githubusercontent.com/74856333/233984718-9b056a60-2fd4-4120-9a40-6750b9c22ccc.png)

![image](https://user-images.githubusercontent.com/74856333/233985151-6a32b05e-ca57-4cdb-8933-8fccd145df8c.png)

![image](https://user-images.githubusercontent.com/74856333/234002880-cdb8db5b-39d1-4d42-8a72-1869331f6b63.png) ![image](https://user-images.githubusercontent.com/74856333/234002908-e16acca7-cd18-4e40-a221-0c1d69424090.png)


### Clear Data before returning from Subworkflow
![image](https://user-images.githubusercontent.com/74856333/233985371-7ba64dee-711b-4edf-bdf9-9523cc480062.png)
![image](https://user-images.githubusercontent.com/74856333/233985417-eaf6c696-d398-4e27-990a-e13b04189ee1.png)


## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## Version history

v2.1: Added option for max manual batches
v2: Added option for running batches in a subworkflow
v1: first version.


