module.exports = function() {
	var questions = [
		{
			"money": 5000,
			"id": 0,
			"multi" : true,
			"subject" : "Python",
			"description" : "在 Python 中，下列哪些資料結構是唯讀的？ (多選)",
			"options" : [
				"tuple", 
				"list", 
				"dict", 
				"string"
			],
			"correct" : [ 0, 3 ]
		},

		{
			"money": 3000,
			"id": 1,
			"multi" : false,
			"subject" : "Secure",
			"description" : "下列那一項情境在傳輸資料時，會將內容加密？ (單選)",
			"options" : [
				"瀏覽總統府網站 http://www.president.gov.tw/", 
				"上 Youtube 看實況 https://www.youtube.com/", 
				"用以明文傳輸的 telnet 上 PTT 八卦板", 
				"以上皆有將內容加密"
			],
			"correct" : [ 1 ]
		},

		{
			"money": 2000,
			"id": 2,
			"multi" : false,
			"subject" : "Secure",
			"description" : "2017 年 2 月，台灣有諸多證券商遭到駭客攻擊，駭客利用殭屍電腦發出大量封包，癱瘓目標網路，該攻擊稱為？ (單選)",
			"options" : [
				"雞雞攻擊 (chiken attack)", 
				"鯊魚海底電纜攻擊 (sharks attack on cables)", 
				"線路洪水攻擊 (link flooding attack, LFA)", 
				"分散式阻斷服務攻擊 (distributed denial-of-service attack, DDoS)"
			],
			"correct" : [ 3 ]
		},

		{
			"money": 5000,
			"id": 3,
			"multi" : false,
			"subject" : "Secure",
			"description" : "「替換式密碼」是將明文字母，用替換的方式進行加密，例如將英文的字母對應到注音符號。若我們只知道被加密後的注音符號，則最容易採用何種方式破解？ (單選)",
			"options" : [
				"頻率分析：分析每個字出現的頻率", 
				"暴力窮舉法：直接暴力窮舉所有可能性", 
				"機器學習：透過非監督式的機器學習，以及強化學習加上回饋函數，讓電腦自動計算", 
				"以上皆無法破解"
			],
			"correct" : [ 0 ]
		},

		{
			"money": 3000,
			"id": 4,
			"multi" : false,
			"subject" : "Secure",
			"description" : "資訊營結業時要頒發獎狀給小明，而小明必須輸入他的名字，該獎狀樣板如下：</br>『恭喜資訊營小隊員 (小明輸入的名字) 獲得精神總錦標』</br>但小明不懷好意，想要惡整同學小華，於是他輸入了「小華告白失敗，怒而自宮，精神可佳，因此」，所以這個獎狀就變成這樣：『恭喜資訊營小隊員 小華告白失敗，怒而自宮，精神可佳，因此獲得精神總錦標』</br>請問小明的行為，與網站哪種常見攻擊有異曲同工之妙？ (單選)",
			"options" : [
				"XSS 跨網站指令碼攻擊", 
				"CSRF 跨站請求偽造攻擊", 
				"SQL Injection 資料庫隱碼/注入攻擊", 
				"Broken Authentication 身分驗證功能缺失"
			],
			"correct" : [ 2 ]
		},

		{
			"money": 5000,
			"id": 5,
			"multi" : false,
			"subject" : "Network",
			"description" : "馬撈家中對外的網路連線只有一個public IP，但因為他是個強大的電腦工程師，因此有10台電腦都必須經由該public IP連接上網際網路。下列哪個技術或服務是他為了達成這個目的而會用到的呢？ (單選)",
			"options" : [
				"IPv6，Internet Protocol version 6，網際網路通訊協定第6版", 
				"NAT，Network Address Translation，網路位址轉換", 
				"Firewall，防火牆", 
				"DNS，Domain Name System，網域名稱系統"
			],
			"correct" : [ 1 ]
		},

		{
			"money": 3000,
			"id": 6,
			"multi" : false,
			"subject" : "Network",
			"description" : "小當家是名偉大的中華料理廚師，在外闖蕩多年，為了再次精進自己的廚藝，他決定回老家中國四川學習「麻婆豆腐」的精髓。然而學習過程並不順遂，正當他在四川想要上Facebook打卡分享悲傷心情順便上個Hashtag時，發現竟然連不上Facebook!! 看來中國強大的『長城』真是滴水不漏啊。如果小當家還是堅持要上Facebook打卡，下列哪個技術或服務可以幫助他連上Facebook呢？ (單選)",
			"options" : [
				"IoT，Internet of Things，物聯網", 
				"DHCP，Dynamic Host Configuration Protocol，動態主機設定協定", 
				"NAT，Network Address Translation，網路位址轉換", 
				"VPN，Virtual Private Network，虛擬私人網路"
			],
			"correct" : [ 3 ]
		},

		{
			"money": 5000,
			"id": 7,
			"multi" : false,
			"subject" : "Network",
			"description" : "下列哪個Subnet皆屬於Private IP？ (單選)",
			"options" : [
				"10.88.0.256",
				"8.8.8.8",
				"172.40.21.244",
				"192.168.241.125",
				"31.13.87.36"
			],
			"correct" : [ 3 ]
		},

		{
			"money": 5000,
			"id": 8,
			"multi" : false,
			"subject" : "Network",
			"description" : "請問URL <strong>www.csie.ntu.edu.tw</strong> 對應到的IP是? (單選)",
			"options" : [
				"31.13.87.36", 
				"140.112.30.26 ", 
				"202.169.173.217", 
				"203.72.178.253",
				"216.58.200.37"
			],
			"correct" : [ 1 ]
		},

		{
			"money": 3000,
			"id": 9,
			"multi" : true,
			"subject" : "Network",
			"description" : "下列哪些IP屬於140.112.0.0/12的子網域內？ (多選)",
			"options" : [
				"140.112.37.223",
				"140.112.253.99",
				"140.114.2.243",
				"140.118.77.103",
				"140.132.1.30"
			],
			"correct" : [ 0, 1, 2, 3 ]
		},

		{
			"money": 2000,
			"id": 10,
			"multi" : false,
			"subject" : "Python",
			"description" : "下列哪些不是 Python 可以辦到的事情？ (單選)",
			"options" : [
				"動態網頁爬蟲", 
				"機器學習", 
				"架設動態網站", 
				"自然語言處理",
				"以上皆非"
			],
			"correct" : [ 4 ]
		},

		{
			"money": 8000,
			"id": 11,
			"multi" : true,
			"subject" : "Python",
			"description" : "下列哪一個 Python 語法是錯誤的？(A,B 型態皆為 Int) (多選)",
			"options" : [
				"if A = B:", 
				"for A in range(2017):", 
				"A,B = (1,2)", 
				"def while(self, A, B):"
			],
			"correct" : [ 0, 3 ]
		},

		{
			"money": 3000,
			"id": 12,
			"multi" : false,
			"subject" : "Python",
			"description" : "下列何者並非 Python 的注解符號？ (單選)",
			"options" : [
				"\"\"\"\"\"\"", 
				"#", 
				"//", 
				"''''''"
			],
			"correct" : [ 2 ]
		},

		{
			"money": 8000,
			"id": 13,
			"multi" : false,
			"subject" : "Python",
			"description" : '以下 Python 程式碼執行後會印出？<img src="img/q13.png" style="height:217.6px; width:377.64px; float:right;"> (單選)',
			"options" : [
				"145", 
				"None", 
				"45", 
				"Error message"
			],
			"correct" : [ 2 ]
		},

		{
			"money": 2000,
			"id": 14,
			"multi" : false,
			"subject" : "Machine Learning",
			"description" : "下列哪個問題最不適合使用機器學習的方法解決？ (單選)",
			"options" : [
				"判斷一封電子郵件是不是垃圾信件", 
				"利用氣象台的觀測資料預測未來七天的天氣",
				"利用數字的各種表示法(ex: 二進位、八進位)判斷輸入的數字是不是偶數",
				"判斷照片中的人臉的年紀與性別"
			],
			"correct" : [ 2 ]
		},

		{
			"money": 2000,
			"id": 15,
			"multi" : true,
			"subject" : "Machine Learning",
			"description" : "下列哪些方法有助於解決過適化(Overfitting)的問題？ (多選)",
			"options" : [
				"找到更多的訓練用的資料",
				"「這一定是不夠深」，所以加強模型的能力(capability)",
				"去找一些無關的資料且胡亂標上標籤，混淆視聽",
				"在電腦的兩側放上蠟燭，讓電腦相信你是虔誠的資料科學家",
				"接受「你的模型跟你的人生一樣一無是處」的事實"
			],
			"correct" : [ 0 ]
		},

		{
			"money": 8000,
			"id": 16,
			"multi" : true,
			"subject" : "Machine Learning",
			"description" : "以下關於機器學習的描述，何者正確？ (多選)",
			"options" : [
				"機器學習的模型在手上的資料做得很好並不表示這是個很好的模型",
				"挑選假說集合(hypothesis set)時，應該盡量挑選能力較弱的假說集合以避免overfitting",
				"對於同一個問題，不同的損失函數(loss function)不會影響最好解出來的模型為何",
				"利用模擬退火法做最佳化(optimization)時，可能會停在區間極小值而無法得到全域最小值",
				"比起直接選用(與答案的差距)的絕對值作為損失函數，使用(與答案的差距)的平方會讓損失函數更為平滑"
			],
			"correct" : [ 0, 3, 4 ]
		},

		{
			"money": 3000,
			"id": 17,
			"multi" : true,
			"subject" : "Machine Learning",
			"description" : "以下哪些問題適合用機器學習解決？ (多選)",
			"options" : [
				"利用一個人的頭髮長度與瞳孔顏色，預測他的國文成績",
				"利用使用者過往點擊廣告的情形，預測使用者喜歡的廣告類型",
				"利用一個人的身高與BMI值，預測他的體重",
				"利用一個人的體脂肪、出生年月日、身高、體重，預測他的年齡",
				"利用電子郵件中的文字，判斷這封信是不是垃圾郵件"
			],
			"correct" : [ 1, 4 ]
		},

		{
			"money": 5000,
			"id": 18,
			"multi" : true,
			"subject" : "Machine Learning",
			"description" : "下列哪些應用是用機器學習的方式實現的？ (多選)",
			"options" : [
				"當你打出特定的字詞時，會回答特定句子的對話機器人",
				"iPhone的Siri將語音資料轉換成文字的過程",
				"網路上流行一陣子的quick, draw!，讓機器人猜你現在畫的東西是什麼",
				"自動駕駛車當中，試著判斷路上的物件的應用",
				"贏過世界棋王的AlphaGO"
			],
			"correct" : [ 1, 2, 3, 4 ]
		},
		{
			"money": 3000,
			"id": 19,
			"multi": false,
			"subject": "Python",
			"description": "下列哪一行程式會出現Error？（單選）", 
			"options": [
				"c = []",
				"s = <>",
				"i = ()",
				"e = {}",
			],
			"correct": [1]
		},
		{
			"money": 5000,
			"id": 20,
			"multi": false,
			"subject": "Python",
			"description" : "下列c、s、i、e哪一個的值跟其他三個不一樣？ (單選)",
			"options": [
				"c = 2 + 2",
				"s = 2 ** 2",
				"i = 2 ^ 2",
				"e = 2 * 2",
			],
			"correct": [2]

		},
		{
			"money": 5000,
			"id": 21,
			"multi": true,
			"subject": "Python",
			"description" : "下列哪些是Python內建函式(Build-in Functions)？ (多選)",
			"options": [
				"int()",
				"sorted()",
				"sum()",
				"abs()",
				"len()",
			],
			"correct": [0, 1, 2, 3, 4]

		},
		{
			"money": 2017,
			"id": 22,
			"multi": true,
			"subject": "送分題",
			"description" : "這次資訊營的標題是什麼？ (單選)",
			"options": [
				"2017臺大資訊營-你的城市",
				"2087臺大資訊營-你的程式",
				"2017臺大資訊營-你的名字",
				"2017臺大資訊營-你的程式",
			],
			"correct": [3]

		}
	];

	/* shuffle */
	var j, x;
	for (var i = questions.length; i; i--) {
		j = Math.floor(Math.random() * i);
		x = questions[i - 1];
		questions[i - 1] = questions[j];
		questions[j] = x;
	}
	return questions;
};
