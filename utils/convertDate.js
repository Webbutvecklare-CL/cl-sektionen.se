export function convertDate(date){
    var y = String(date.getUTCFullYear());
    var m = String(date.getUTCMonth());
    var d = String(date.getUTCDate());
    
    if (m.length < 2) {
    m = "0" + m;
    }

    if (d.length < 2) {
    d = "0" + d;
    }

    return [y, m, d].join("-");
}