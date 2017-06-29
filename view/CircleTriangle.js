for (var i = 0; i < 5; i++) {

	var newtleft = [0.5, 1, 0.8086, 0.1914, 0];
	var newttop  = [0, 0.3831, 1, 1, 0.3831];
	var parentHeight = 700;
	var parentWidth = 900;

	document.write('<div class="triangle" id="t' + i + '"></div>');
	$('#t'+i).css('left', newtleft[i]*parentWidth-40);
	$('#t'+i).css('top', newttop[i]*parentHeight-34.8);

	if( i==0 || i==2 || i==3 ) {
		for (var j = 1; j < 4; j++) {
			document.write('<div class="circle" id="s' + i + '' + j + '"></div>');
			var topvalue = 0.5*parentHeight - 30.8 + 0.25*j*( ( newttop[i] - 0.5 ) * parentHeight - 4.8 );
			var leftvalue = 0.5*parentWidth - 22.4 + 0.25*j*( ( newtleft[i] - 0.5 ) * parentWidth - 7.6 );
			$('#s'+i+''+j).css('left', leftvalue);
			$('#s'+i+''+j).css('top', topvalue);
		}	
	}

	for (var j = 1; j < 6; j++) {
		var nexti = (i+1)%5;
    	document.write('<div class="circle" id="c' + i + '' + j + '"></div>');
    	var topvalue = newttop[i]*parentHeight - 34.8 + 1/6 * j * ( newttop[nexti]*parentHeight - 34.8 - ( newttop[i]*parentHeight - 34.8 )   ) + 8.8 ;
    	var leftvalue = newtleft[i]*parentWidth - 40 + 1/6 * j * ( newtleft[nexti]*parentWidth - 40 - (newtleft[i]*parentWidth - 40 )  ) + 15;
		$('#c'+i+''+j).css('left', leftvalue);
		$('#c'+i+''+j).css('top', topvalue);
    }	

}
