#### Node-Webkit Edge.js Proof of Concept

A proof of concept that node-webkit can be used with edge.js to leverage C# code
to talk to other .NET applications. At a previous job we wrote a lot of
applications as ActiveX controls due to being constraint to IE 8 (enterprise!).
This was something I put together as an alternative to writing web applications
for IE 8. The proof of concept also had a server that served up a dll that
Edge.js would use to call C# methods from. The code can be found
[here](https://github.com/kschat/dll-server).
