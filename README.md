#Project Two - Garon Bailey

##Gobias Industries Wiki

### User Stories

Henrietta was just hired as the new office manager of Gobias Industries. She decided it would be good to make an online repository of employee documents in the form of a wiki.

Employees should be able to make an account, login, write articles, and edit articles. The articles have tags attached at the bottom that you can search for more articles in the same category. You can find all employees and their contact information to talk to them about anything they've written.

### Acknowledgements

The method for linking tags to a search was created by Matthew Short. I can take no credit for the clean look of that.

### Wireframe

I will admit that I do not enjoy wireframes. I find that they don't help me very much, or at the very least, I can't concentrate long enough to actually make a good one. I find them time-consuming when I already have limited time to make a working app. I started a wireframe, but didn't put much time into it. It might be the same idea, but I have hand-written notes that basically go over the same ideas as a wireframe, but not diagrammed. I can show those to whomever may seek them if requested, but below is an image of my piddly, ill-conceived wireframe.

![Image of wireframe](http://www.gliffy.com/go/publish/image/9186547/S.png)

### Problems

I had a lot of problems keeping track of data. I wanted to have a separate JS file that dynamically rendered elements based on the current user, but I could never figure out how to get access to the current user in the separate file. 

I also could never make modules or module.exports work. Therefore, my server.js file is huge and vaguely unwieldy.

I got the bare minimum functionality, basically, because the few things that I could never figured out became major time-sucks, with zero payoff.

### Future Considerations

In the future, I would like to add more information to the editing. I got close, but had to scrap it for time and never got to come back. Therefore, right now, the edits don't display an editor name, and I'm not even sure I have them displaying at this point because I could never make it work.

I would like to add password encryption. Again, something I just didn't get to because of time.

I would like to break the server.js in controllers to make the files smaller and more easily digestible. 

Of course, I would love a better design and layout. I am by no means a designer.

I *need* to add a log out button to the user, as well as the ability for a user to edit their login credentials, contact information, title, and name if need be.