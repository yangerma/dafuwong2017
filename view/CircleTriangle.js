var tleft = ['50% - 40px', '100% - 40px', '80.86% - 40px', '19.14% - 40px', '0% - 40px' ];
var ttop  = ['0% - 34.8px', '38.31% - 34.8px', '100% - 34.8px', '100% - 34.8px', '38.31% - 34.8px'];
for (var i = 0; i < 5; i++) {

	var iContent;
	iContent = '<div class="triangle" id="t' + i + '"';
	iContent += ' style="top:calc(' +ttop[i]+ '); left:calc(' +tleft[i]+ ');"></div>';
	document.write(iContent);

	if( i==0 || i==2 || i==3 ) {
		for (var j = 1; j < 4; j++) {
			var sContent;
			sContent = '<div class="circle" id="s' + i + '' + j + '"';
			sContent += ' style="top:calc( 50% - 30.8px + 1/4 * ' +j+ ' * (' +ttop[i]+ ' - 50% + 30.8px ) );';
			sContent += ' left:calc( 50% - 32.4px + 1/4 * ' +j+ ' * (' +tleft[i] + ' - 50% + 32.4px ) + 10px );"></div>';
			document.write(sContent);
		}	
	}

	for (var j = 1; j < 6; j++) {
		var jContent;
		var nexti = (i+1)%5;
		jContent = '<div class="circle" id="c' + i + '' + j + '"';
		jContent += ' style="top:calc( '+ttop[i]+' + 1/6 * ' +j+ ' * (' +ttop[nexti]+ ' - (' +ttop[i]+ ')  ) + 8.8px );';
		jContent += ' left:calc( '+tleft[i]+' + 1/6 * ' +j+ ' * (' +tleft[nexti]+ ' - (' +tleft[i] + ')  ) + 15px );"></div>';
    	document.write(jContent);
    }	

}
