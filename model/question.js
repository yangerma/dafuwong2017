var questions = [

	{
		"id": 0,
		"subject" : "Python",
		"description" : "在 Python 中，下列哪些資料結構是唯獨的是錯誤的",
		"options" : [
			"tuple", 
			"list", 
			"dict", 
			"string"
		],
		"correct" : [ 0, 3 ]
	},

	{
		"id": 1,
		"subject" : "Secure",
		"description" : "下列那一項情境在傳輸資料時，會將內容加密？",
		"options" : [
			"瀏覽總統府網站 http://www.president.gov.tw/", 
			"上 Youtube 看實況 https://www.youtube.com/", 
			"用以明文傳輸的 telnet 上 PTT 八卦板", 
			"以上皆有將內容加密"
		],
		"correct" : [ 1 ]
	},

	{
		"id": 2,
		"subject" : "Secure",
		"description" : "2017 年 2 月，台灣有諸多證券商遭到駭客攻擊，駭客利用殭屍電腦發出大量封包，癱瘓目標網路，該攻擊稱為？",
		"options" : [
			"雞雞攻擊 (chiken attack)", 
			"鯊魚海底電纜攻擊 (sharks attack on cables)", 
			"線路洪水攻擊 (link flooding attack, LFA)", 
			"分散式阻斷服務攻擊 (distributed denial-of-service attack, DDoS)"
		],
		"correct" : [ 3 ]
	},

	{
		"id": 3,
		"subject" : "Secure",
		"description" : "「替換式密碼」是將明文字母，用替換的方式進行加密，例如將英文的字母對應到注音符號。若我們只知道被加密後的注音符號，則最容易採用何種方式破解？",
		"options" : [
			"頻率分析：分析每個字出現的頻率", 
			"暴力窮舉法：直接暴力窮舉所有可能性", 
			"機器學習：透過非監督式的機器學習，以及強化學習加上回饋函數，讓電腦自動計算", 
			"以上皆無法破解"
		],
		"correct" : [ 0 ]
	},

	{
		"id": 4,
		"subject" : "Secure",
		"description" : "資訊營結業時要頒發獎狀給小明，而小明必須輸入他的名字，該獎狀樣板如下：</br>『恭喜資訊營小隊員 (小明輸入的名字) 獲得精神總錦標』</br>但小明不懷好意，想要惡整同學小華，於是他輸入了「小華告白失敗，怒而自宮，精神可佳，因此」，所以這個獎狀就變成這樣：『恭喜資訊營小隊員 小華告白失敗，怒而自宮，精神可佳，因此獲得精神總錦標』</br>請問小明的行為，與網站哪種常見攻擊有異曲同工之妙？",
		"options" : [
			"XSS 跨網站指令碼攻擊", 
			"CSRF 跨站請求偽造攻擊", 
			"SQL Injection 資料庫隱碼/注入攻擊", 
			"Broken Authentication 身分驗證功能缺失"
		],
		"correct" : [ 2 ]
	},

	{
		"id": 5,
		"subject" : "Network",
		"description" : "馬撈家中對外的網路連線只有一個public IP，但因為他是個強大的電腦工程師，因此有10台電腦都必須經由該public IP連接上網際網路。下列哪個技術或服務是他為了達成這個目的而會用到的呢？(單選)"
		"options" : [
			"IPv6，Internet Protocol version 6，網際網路通訊協定第6版", 
			"NAT，Network Address Translation，網路位址轉換", 
			"Firewall，防火牆", 
			"DNS，Domain Name System，網域名稱系統"
		],
		"correct" : [ 1 ]
	},

	{
		"id": 6,
		"subject" : "Network",
		"description" : "小當家是名偉大的中華料理廚師，在外闖蕩多年，為了再次精進自己的廚藝，他決定回老家中國四川學習「麻婆豆腐」的精髓。然而學習過程並不順遂，正當他在四川想要上Facebook打卡分享悲傷心情順便上個Hashtag時，發現竟然連不上Facebook!! 看來中國強大的『長城』真是滴水不漏啊。如果小當家還是堅持要上Facebook打卡，下列哪個技術或服務可以幫助他連上Facebook呢？(單選)"
		"options" : [
			"IoT，Internet of Things，物聯網", 
			"DHCP，Dynamic Host Configuration Protocol，動態主機設定協定", 
			"NAT，Network Address Translation，網路位址轉換", 
			"VPN，Virtual Private Network，虛擬私人網路"
		],
		"correct" : [ 3 ]
	},

	{
		"id": 7,
		"subject" : "Network",
		"description" : "下列哪些Subnet皆屬於Private IP？(多選)"
		"options" : [
			"172.25.0.0/255.255.0.0", 
			"192.168.204.0/255.255.255.0", 
			"10.0.0.0/255.0.0.0", 
			"172.16.0.0/255.0.0.0",
			"140.112.0.0/255.255.0.0"
		],
		"correct" : [ 0, 1, 2 ]
	},

	{
		"id": 8,
		"subject" : "Network",
		"description" : "請問URL <strong>www.csie.ntu.edu.tw</strong> 對應到的IP是?(單選)"
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
		"id": 9,
		"subject" : "Network",
		"description" : "台大校園內的網路錯綜複雜，為了有效的管理，校園各處充滿的各種網路設備，計算機與網路中心的機房內，其規模之龐大更是難以計數。請問下列哪一種設備在校園的核心骨幹網路中，現在通常已經逐漸淘汰而不再使用？(單選)"
		"options" : [
			"Hub，集線器", 
			"Switch，交換器", 
			"Router，路由器"
		],
		"correct" : [ 0 ]
	},

	{
		"id": 10,
		"subject" : "Python",
		"description" : "下列哪些不是 Python 可以辦到的事情？"
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
		"id": 11,
		"subject" : "Python",
		"description" : "下列哪一個 Python 語法是錯誤的？(A,B 型態皆為 Int)"
		"options" : [
			"if A = B:", 
			"for A in range(2017):", 
			"A,B = (1,2)", 
			"def while(self, A, B):"
		],
		"correct" : [ 0, 3 ]
	},

	{
		"id": 12,
		"subject" : "Python",
		"description" : "下列何者並非 Python 的注解符號？"
		"options" : [
			"\"\"\"\"\"\"", 
			"#", 
			"//", 
			"''''''"
		],
		"correct" : [ 2 ]
	},

	{
		"id": 13,
		"subject" : "Python",
		"description" : "以下 Python 程式碼執行後會印出？</br>def bar(a):</br>  return [ x+10 for x in a ]</br>def foo(a):</br>　sum = 0</br>　for x in a:</br>　　sum += x</br>　return sum</br></br>a = [0,1,2,3,4,5,6,7,8,9]</br>bar(a)</br>print (foo(a))"
		"options" : [
			"145", 
			"None", 
			"45", 
			"Error message"
		],
		"correct" : [ 2 ]
	},

]