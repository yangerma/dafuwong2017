import socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(('', 9487))

s.send("Im Pusheen")
print s.recv(1024)
s.close()
