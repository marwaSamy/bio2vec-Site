
def factor="0|0.910810 1|-0.804124 2|-0.552777 3|-0.341324 4|0.568955 5|0.032517 6|-0.017415 7|-0.161339 8|-0.611583 9|-0.715309 10|0.079143 11|0.285751 12|-0.648942 13|-0.088265 14|0.755216 15|-0.188619 16|0.544965 17|0.546923 18|-0.403800 19|0.380628 20|-0.587210 21|0.227568 22|0.236602 23|-0.618257 24|-0.803029 25|0.154120 26|-0.428505 27|0.139087 28|0.303370 29|0.313763 30|-0.583738 31|0.145154 32|-0.228477 33|0.971632 34|0.333301 35|0.374831 36|-0.386376 37|-0.599952 38|0.505117 39|0.487538 40|-0.440335 41|0.104564 42|0.409041 43|0.356655 44|-0.556857 45|-0.495638 46|-0.078537 47|-0.175241 48|0.025215 49|-0.637362 50|0.125538 51|0.018240 52|0.077325 53|-0.001195 54|-0.007038 55|-0.298493 56|0.151731 57|0.337924 58|-0.340150 59|-0.054069 60|0.487933 61|0.212483 62|-0.315517 63|0.028320 64|0.376178 65|0.876579 66|0.217004 67|-0.251231 68|0.400795 69|0.990319 70|-0.126957 71|0.617007 72|0.049428 73|-0.464513 74|-0.532220 75|0.337830 76|-0.021695 77|0.506086 78|-0.322268 79|-0.299226 80|0.308444 81|0.959789 82|0.399830 83|-0.261666 84|0.282242 85|-0.058409 86|-0.480911 87|0.371663 88|0.735819 89|0.263997 90|-0.141455 91|-0.265570 92|-0.076262 93|0.183149 94|0.113421 95|-0.164146 96|-0.188506 97|-0.016430 98|0.316351 99|-0.076431"

def factorarray=factor.split()

factorarray.each{

	it.replaceAll("*|", "")
	println it
}

