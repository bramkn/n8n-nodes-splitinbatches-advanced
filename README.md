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

v1: first version. No new functionality in development at this time.


