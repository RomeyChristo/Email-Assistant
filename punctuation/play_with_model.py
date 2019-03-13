# coding: utf-8

from __future__ import division
import requests
import models
import data
import re
import theano
import sys
import codecs
import smtplib
import theano.tensor as T
import numpy as np
reload(sys)
sys.setdefaultencoding("utf-8")
from urllib import urlencode
import urllib2
import json
from websocket_server import WebsocketServer


def sendmailfoo(msg):
    result = msg.split("||")
    sender = result[0]
    TOA = result[1] #"a@b.com,c@d.com".split(",")
    newto=TOA.split(",")
    for i in range(0,len(newto)):
        newto[i]="<"+newto[i]+">"
    CC = result[2]
    newcc=CC.split(",")
    for i in range(0,len(newcc)):
        newcc[i]="<"+newcc[i]+">"
    BCC = result[3]
    newbcc=BCC.split(",")
    for i in range(0,len(newbcc)):
        newbcc[i]="<"+newbcc[i]+">"
    fto=",".join(newto)
    fcc=",".join(newcc)
    fbcc=",".join(newbcc)
    FROM = 'user@emailassist.ml'

    from_addr = "%s<user@emailassist.ml>" % sender 
    SUBJECT = result[4]
    TEXT = result[5]
    TO=TOA.split(",")+CC.split(",")+BCC.split(",")
    message = "From: " + from_addr + "\nTo: " + fto + "\nCC: " + fcc + "\nBCC: " + fbcc + "\nMIME-Version: 1.0\nContent-type: text/html\nSubject: " + SUBJECT + "\n" + TEXT
    def sendemail(login='*add login here*', password='*add password here*', smtpserver='*add smtpserver here*'):
        server = smtplib.SMTP(smtpserver)
        server.starttls()
        server.login(login,password)    
        problems = server.sendmail(FROM, TO, message)
        server.quit()

    sendemail() 

def grammarfix(data,reply):
    x=len(json.loads(reply)["matches"])
    b = data["text"]

    errnew=[]
    def perrnew():
        errnew.append(errw)
    for i in range(x-1, -1,-1):
        #print(i)
        val = json.loads(reply)["matches"][i]["replacements"][0]["value"]

        off = json.loads(reply)["matches"][i]["offset"]
        #print "off %d" %off
        lenof = json.loads(reply)["matches"][i]["length"]
        #print "length %d" %lenof
        errl=off+lenof
        errw=b[off:errl]
        #print errw
        if errw == " .":
            errw = "."
            #print errw
            perrnew()
        elif errw == " ?":
            errw = "?"
            #print errw
            perrnew()
        elif errw == " !":
            errw = "!"
            #print errw
            perrnew()
        elif errw == " ,":
            errw = ","
            #print errw
            perrnew()
        else:
            errw=val
            #print errw
            perrnew()
                
    print ([str(a) for a in errnew])

    result = data["text"]

    for j in range(x-1, -1,-1):
        #print j
        
        off = json.loads(reply)["matches"][j]["offset"]
        lenof = json.loads(reply)["matches"][j]["length"]
        errl=off+lenof
        k=x-(j+1)
        result = list(result)
        result[off:errl] = errnew[k]
        result="".join(result)
    return result

def http_post(url, data):
    post = urlencode(data)
    req = urllib2.Request(url, post)
    response = urllib2.urlopen(req)
    return response.read()
    
def new_client(client, server):
        #server.send_message_to_all("Hey all, a new client has joined us")
    #server.send_message(client, "")
    print("new client connected")

def message_received(client, server, msg):
    if msg[0:5]=="punc:":
        punctuate_message(msg[5:],client,server)
    elif msg[0:5]=="mail:":
        sendmailfoo(msg[5:])

def punctuate_message(msg,client,server):
    output = punctuate(predict, word_vocabulary, punctuation_vocabulary,
                       reverse_punctuation_vocabulary, reverse_word_vocabulary, msg, False)
    punc_text = wrep(output, wordDic)
    punc_text = punc_text[:-2]
    url = "http://127.0.0.1:8081/v2/check"
    data = {}
    data["text"] = punc_text
    data["language"] = "en-US"
    data["enabledOnly"] = "false"
    reply = http_post(url, data)
    x=len(json.loads(reply)["matches"])
    result = grammarfix(data,reply)
    server.send_message(client, result)
    
    #sendmail(result)
    
    #print("Client(%d) said: %s" % (client['id'], message))

def wrep(text, wordDict):
    for key in wordDict:
        text = text.replace(key, wordDict[key])
    return text

wordDic = {
    'QUESTIONMARK': '',
    'EXCLAMATIONMARK': '',
    'COMMA': '',
    'DASH': '',
    'COLON': '',
    'SEMICOLON': '',
    'PERIOD': ''}

def to_array(arr, dtype=np.int32):
    # minibatch of 1 sequence as column
    return np.array([arr], dtype=dtype).T

def convert_punctuation_to_readable(punct_token):
    if punct_token == data.SPACE:
        return " "
    else:
        return punct_token[0]

def punctuate(predict, word_vocabulary, punctuation_vocabulary, reverse_punctuation_vocabulary, reverse_word_vocabulary, text, show_unk):

    if len(text) == 0:
        sys.exit("Input text from stdin missing.")

    text = [w for w in text.split() if w not in punctuation_vocabulary] + \
        [data.END]

    i = 0
    output = ""
    while True:

        subsequence = text[i:i+data.MAX_SEQUENCE_LEN]

        if len(subsequence) == 0:
            break

        converted_subsequence = [word_vocabulary.get(
            w, word_vocabulary[data.UNK]) for w in subsequence]
        if show_unk:
            subsequence = [reverse_word_vocabulary[w]
                           for w in converted_subsequence]

        y = predict(to_array(converted_subsequence))

        output += subsequence[0]

        last_eos_idx = 0
        punctuations = []
        for y_t in y:

            p_i = np.argmax(y_t.flatten())
            punctuation = reverse_punctuation_vocabulary[p_i]

            punctuations.append(punctuation)

            if punctuation in data.EOS_TOKENS:
                # we intentionally want the index of next element
                last_eos_idx = len(punctuations)

        if subsequence[-1] == data.END:
            step = len(subsequence) - 1
        elif last_eos_idx != 0:
            step = last_eos_idx
        else:
            step = len(subsequence) - 1

        for j in range(step):
            output += (" " + punctuations[j] +
                       " " if punctuations[j] != data.SPACE else " ")
            if j < step - 1:
                output += (subsequence[1+j])

        if subsequence[-1] == data.END:
            break

        i += step

    return output

model_file = "(enter_path_here)\Demo-Europarl-EN.pcl"
show_unk = False

x = T.imatrix('x')
print "Loading model parameters..."
net, _ = models.load(model_file, 1, x)

print "Building model..."
predict = theano.function(inputs=[x], outputs=net.y)
word_vocabulary = net.x_vocabulary
punctuation_vocabulary = net.y_vocabulary
reverse_word_vocabulary = {v: k for k, v in net.x_vocabulary.items()}
reverse_punctuation_vocabulary = {v: k for k, v in net.y_vocabulary.items()}

server = WebsocketServer(8765, host='127.0.0.1')
server.set_fn_new_client(new_client)
server.set_fn_message_received(message_received)
server.run_forever()
