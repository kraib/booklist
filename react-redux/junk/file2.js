function file2(){
    alert('hello');
}

let s = document.createElement('script');
s.setAttribute('src', '/react-redux/junk/file1.js?ver=2');
s.setAttribute('type', 'text/javascript');
document.head.appendChild(s);