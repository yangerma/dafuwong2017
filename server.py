import socket

serv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

print socket.gethostname()
serv.bind(('localhost', 9487))
serv.listen(2)

while 1:
	(csock, addr) = serv.accept()
	print "Client info: ", csock, addr
	msg = csock.recv(10)
	if not msg:
		pass
	else:
		print "Client send: " + msg
		csock.send("Hello Pusheen\n")
	csock.close()

	
