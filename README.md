# n8n-nodes-splitinbatches-advanced

This is an n8n community node. It gives you an extra output of the split in batches node. 
This path will be taken when the split in batches node is done with its loop of batches. It also gives you the option to combine all the results from batches before continuing on this "Done" path. 

If you want to use this node as a normal split in batches node that is possible, simply don't add an output to the Done path.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Compatibility

This node was developed and tested with version 0.193.3.

## Usage

![SplitInBatchesAdvanced](https://github.com/bramkn/n8n-nodes-splitinbatches-advanced/blob/master/images/SplitInBatchesAdvanced.png)

The node works the same as the split in batches node. But with some quality of life additions.
* [n8n splitinbatches node docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.splitinbatches/)

The node will continue on the Done path when the batches are finished processing.
The node has the option to combine the data into one list of items, instead of the split runs of items.

![SplitInBatchesAdvancedCombine](https://github.com/bramkn/n8n-nodes-splitinbatches-advanced/blob/master/images/SplitInBatchesAdvancedCombine.png)

The data returned is the data coming into the node after each iteration of the loop.




## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## Version history

_This is another optional section. If your node has multiple versions, include a short description of available versions and what changed, as well as any compatibility impact._


