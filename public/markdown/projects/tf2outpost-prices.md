#### TF2Outpost Price Integration

A Chrome Extension I wrote in college (and rewrote in 2014) that pulls TF2 item
prices from [backpack.tf's](http://backpack.tf/) Price API and maps those prices
to items on [TF2Outpost](http://tf2Outpost.com). The extension gives the user
the ability to configure various settings via a "Page Action" that are updated
live. Since backpack.tf's API requires an API user token, I wrote a caching and
proxy server in node which can be seen
[here](https://github.com/kschat/tf2outpost-prices-chrome-extension-rest).
