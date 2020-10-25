var currURL = decodeURI(document.URL);
var allText;
var answer = "";
if(currURL.includes("&answer=")){
  allText = currURL.substring(currURL.indexOf("?shortText=")+11,currURL.indexOf("&answer="));
  answer = currURL.substring(currURL.indexOf("&answer=")+8,currURL.length);
  document.querySelector(".answer").innerHTML = answer;
}else{
  allText = currURL.substring(currURL.indexOf("?shortText=")+11,currURL.length);
  document.querySelector(".answer").style.display = "none";
}
document.querySelector(".shortTextShow").innerHTML =allText;
document.querySelector(".linkText").value = allText;
