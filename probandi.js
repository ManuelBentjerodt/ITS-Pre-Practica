var d = new Date,
    dformat = [
               d.getDate(),
               d.getMonth()+1,
               d.getFullYear()].join('/')+' '+
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':');

function getDate() {
    const d = new Date;
    const dmy = [
        d.getDate(),
        d.getMonth()+1,
        d.getFullYear()
    ];
    
    const hms = [
        d.getHours(),
        d.getMinutes(),
        d.getSeconds()
    ]
    
    const date = dmy.join('/') + ' ' + hms.join(':');
    return date;
}

console.log(getDate())