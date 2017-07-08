function showQuestion(){

	var q = model.question;
	$('#questionBox').show();
	$('#questionBox #timeLeft').show();
	$('#questionBox .closeButton').hide();
	$('#questionBox #answerResult').hide();
	$('#questionBox .title h1').text(q.subject);
	$('#questionBox .qDes p').text(q.description);
	
	if (playerId == model.nowPlaying) {
		$("#submitButton").show();
	} else {
		$("#submitButton").hide();
	}

	if( q.multi ) {
		$('#questionBox #multiOptions').show();
		$('#questionBox #singleOptions').hide();
		for (var i = 0; i < 5; i++) {
			if( i < q.options.length ) {
				$('#mop'+i).show();
				$('#mop'+i+' label').text( q.options[i] );
			}
			else $('#mop'+i).hide();
		}
	}
	else {
		$('#questionBox #multiOptions').hide();
		$('#questionBox #singleOptions').show();
		for (var i = 0; i < 5; i++) {
			if( i < q.options.length ) {
				$('#sop'+i).show();
				$('#sop'+i+' label').text( q.options[i] );
			}
			else $('#sop'+i).hide();
		}
	}
	$('#questionBox form').show();

	var cnt = 120;
	$('#questionBox #timeLeft').text('剩餘時間：'+cnt);
	timer =  setInterval(function(){
		cnt--;
		$('#questionBox #timeLeft').text('剩餘時間：'+cnt);
		if( cnt == 0 ) {
			clearInterval(timer);
			$('#questionBox #timeLeft').hide();
			$('#answerResult h1').text("來不及了QQ");
			$('#answerResult img').attr( 'src', "img/wrong.png" );
			var correctAns = '正確答案：';
			for (var i = 0; i < q.correct.length; i++) {
				if( i!=0 ) correctAns += ",   ";
				correctAns += ( q.options[ q.correct[i] ] );
			}
			$('#questionBox #answerResult p').text(correctAns);
			$('#questionBox form').hide();
			$('#questionBox .closeButton').show();
			$('#questionBox #answerResult').show();
		}
	} , 1000);

	$('#submitButton').click( function(){
		clearInterval(timer);
		$('#questionBox #timeLeft').hide();
		var ans = [];
		if( !q.multi ) ans.push( Number( $('input[name=qq]:checked').val() ) );
		else {
			$("input:checkbox[name=mq]:checked").each( function(){
			    ans.push( Number( $(this).val() ) );
			});
		}
		socket.emit("answer_question", ans);
		showTurnOver();

	})

}

function showAnswer(ans) {
	var q = model.question;
	var correct = ( JSON.stringify(ans)==JSON.stringify(q.correct) );
	if (correct) {
		$('#answerResult h1').text("答對了！");
		$('#answerResult img').attr( 'src', "img/correct.png" );
	}
	else {
		$('#answerResult h1').text("答錯了QQ");
		$('#answerResult img').attr( 'src', "img/wrong.png" );
	}

	var correctAns = '正確答案：';
	for (var i = 0; i < q.correct.length; i++) {
		if( i!=0 ) correctAns += ",   ";
		correctAns += ( q.options[ q.correct[i] ] );
	}
	
	$('#questionBox #answerResult p').text(correctAns);
	$('#questionBox form').hide();
	$('#questionBox .closeButton').show();
	$('#questionBox #answerResult').show();
}

function closeQuestion() {
	$('#questionBox').hide();
}
