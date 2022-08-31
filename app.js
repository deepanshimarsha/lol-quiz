
  var form = document.querySelector("form")
  var btnSubmit = document.querySelector("#btn-submit")
  var btnRanking = document.querySelector("#btn-ranking")
  var output = document.querySelector("#output")
  var heading = document.querySelector("#rank-list")
  var rankList = document.querySelectorAll("#list")
  var final_score = 0
  var topHeading = document.querySelector("#top_scorer")
  

 
  


  const correct_ans = {"question1":"Snake",  "question2":"Vi",  "question3": "Ashe",  "question4": "129",  "question5": "Thresh", "question6": "fox", "question7": "Yasuo", "question8": "4", "question9": "no", "question10": "Tryndamere"}
  


  function addTopRanker(formData){
    axios({
      method: "post",
      url: "https://lol-quiz-rank.herokuapp.com/api/rank/",
      data: formData,

    })
    .then((response) =>{
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });

  }

  function retrieveTopRanker(playerName, final_score){
    axios.get("https://lol-quiz-rank.herokuapp.com/api/rank/").then(resp => {

    console.log(resp.data)

    var i = 0
    var topScorer= []
    if(resp.data.length < 3){
      for(var j=0; j < resp.data.length; j++)
      topScorer.push({"name": resp.data[j].name, "score" : resp.data[j].score})
    }
    else{
      for(var i =0; i < 3; i++){
        topScorer.push({"name": resp.data[i].name, "score" : resp.data[i].score})
      }
    }
    console.log(topScorer)
    
    if( final_score >= topScorer[topScorer.length-1].score){

      if (playerName.length === 0){
        playerName = "Anonymous"
      }
      var dataObj = {
        "name": playerName,
        "score": final_score
      }
      var formData = new FormData()
      console.log(formData)

      formData.append("name", playerName);
      formData.append("score", final_score);
      console.log(formData)

      //if record broken -> add to database
      addTopRanker(formData)


      //manage temporary top 3 scorers array 
      if(topScorer.length >= 3){
        topScorer.pop()
      }
     
      topScorer.push({"name": playerName, "score": final_score})
      console.log(topScorer)

      topScorer.sort((a, b) => b.score - a.score);

      topScorer.forEach((e) => {
        console.log(`${e.name} ${e.score}`);
    });

      //congratulate message  
      showMessage("Congratulations! You are in the top 3.")
      
    }
    else{
      //sorry message
      console.log(topScorer)
      showMessage("Sorry! You are not in the top 3.")
    }

    topHeading.innerText = "Top Scorers"
    //display top 3 scorer regardles of breaking record
    for(var i=0; i < topScorer.length; i++){
      rankList[i].innerText = topScorer[i].name + " with score " + topScorer[i].score
    }

  })
}


  function RankHandler(playerName, final_score){
    console.log(playerName)
    heading.style.display = "none"


    //get top 3 scorer and create a array of object for them
    retrieveTopRanker(playerName, final_score)
    
  }
    




  function showMessage(msg){
    console.log(msg)
    heading.style.display = "block"
    heading.innerText = msg

  }

  function clickHandler(){
      console.log(final_score)
      var curr_score = 0
      const data = new FormData(form)
      for (let value of data.entries()){
          if(value[1] === correct_ans[value[0]]){
              curr_score = curr_score + 1
          }
      } 
      output.innerText =  "your score is " + curr_score
      final_score = curr_score
      var nameEle = document.querySelector("#name")
      var playerName = nameEle.value
  
     
      RankHandler(playerName, final_score)
      
    }

 
  
  
  
  btnSubmit.addEventListener("click", clickHandler)
  
  