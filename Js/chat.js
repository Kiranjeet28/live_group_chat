    const socket = io('http://localhost:4000', {
      withCredentials: true,
      extraHeaders: {
        'Access-Control-Allow-Origin': 'http://127.0.0.1:5500',
      },
    });
  // variables and constants
    const form = document.getElementById('sendContainer');
    const messageInput = document.getElementById('messageInp');
    const messageContainer = document.querySelector('.container');
  


    // functions 
     // this function use to append the message inside the div 
    const append = (message,position)=>{
      const messageElement = document.createElement('div');
      messageElement.innerText = message;
      messageElement.classList.add('message')
      messageElement.classList.add(position)
      messageContainer.append(messageElement)
    }

     // to Get the name of the user and give to the New-Function
     const name = prompt('Enter your name to join');
     if(name===null || name===undefined){
      alert("Plese enter your name");}
      
     else{
     socket.emit('New-User',name);

     // To broadCast the message to the all we use the user-Joined function
    socket.on('user-joined',(name)=>{
      append(`${name} joined the chat `,'center')
    })
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      const message = messageInput.value;
      append(`You : ${message}`,'right')
      socket.emit('send',message);
      messageInput.value = '';
    })
    socket.on('receive',(data)=>{
      append(`${data.name} :${data.message} `,'left')
    })

    socket.on('leave', (data) => {
      if (data.name !== undefined) {
        append(`${data.name} left the chat `, 'center');
      } else {
        console.log('User left without entering a name');
      }
    });
  }

