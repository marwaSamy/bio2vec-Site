@Grab(group='org.codehaus.groovy.modules.http-builder', module='http-builder', version='0.7.1' )

import groovyx.net.http.HTTPBuilder
import groovy.json.*
import java.net.*
import static groovyx.net.http.Method.GET
import static groovyx.net.http.Method.POST
import static groovyx.net.http.ContentType.*



//def http = new HTTPBuilder('http://ontolinator.kaust.edu.sa:9200/')  url = 'http://10.254.145.46:9200/'

def http = new HTTPBuilder('http://10.254.145.46:9200/')
def vector="-0.314446,-0.133978,-0.129099,-0.318362,-0.273974,0.191204,-0.547515,-0.308699,0.126787,0.011502,-0.748278,1.217183,-0.339379,0.346848,0.094092,0.403861,1.224701,0.843945,0.037190,-0.007574,0.586646,0.100517,0.398447,-0.478374,0.021369,0.189746,-0.266662,-0.018133,0.101102,-0.547411,-0.120648,0.140475 ,0.296893,0.544551,-0.179729,0.194117,-0.085178,-0.244907,0.381531,0.269417,0.369284,0.158607,-0.003086,0.123868,-0.155352,-0.065145,0.677611,0.163266,-0.220746,-0.313098,-0.706380,0.171032,-0.287593,0.815270,-0.228449,0.095639,0.258975,-0.119523,0.171965,0.045461,0.108769,-0.061669,0.218137,0.045531,-0.007614,0.532059,-0.148892,-0.305622,0.016844,0.010370,-0.140422,0.256618 ,0.073326,0.225965,-0.122842,1.049961,-0.626147,0.617606,-0.055169,-0.181789,-0.166056,-0.148194,-0.265765,-0.489735,-0.185962,0.810118,-0.201594,0.197663,0.521216,-0.407828,0.047453,-0.033255,0.297660,0.159781,0.000234,-0.825705,-0.427094,0.155473,0.277065,0.005940"

def dataset="full_text_embeddings"

def id ="1"


if (vector&&id=="0"){
  println 'id=$id'
}

if (vector) {
    vector = vector.split(",").collect { new Double(it)}
   def query = /
       {
    "query": {
        "function_score": {
            "query" : {
                "query_string": {
                    "query": "dataset_name: $dataset"
                }
            },
            "script_score": {
                "script": {
                    "inline": "payload_vector_score",
                "lang": "native",
                "params": {
                    "field": "@model_factor",
                    "vector": $vector,
                    "cosine" : true
                    }
}
            },
            "boost_mode": "replace"
        }
    }
}/

//println query
    def jsonSlurper = new JsonSlurper()
    def js = new JsonBuilder(jsonSlurper.parseText(query))
    //println js
    def par=js.toString()
   def response=http.post( path : '/bio2vec/_search', contentType : JSON  ,body:js.toPrettyString() )  {resp, reader -> t = reader }
  
   //println (new JsonBuilder(jsonSlurper.parseText(t.hits.hits)))
   //println t.hits.hits

    http.shutdown()
    def rmap = []
    def result = new JsonBuilder()
    t.hits.hits.each { hit ->
      //println hit._source
      result.response{
          row hit._source
          /*id  hit._source.id
          name hit._source.name
          dataset_name hit._source.dataset_name*/
        }
      
      /*def row = []
      def rid = hit._source.id
      row << hit._source.name
      row << rid
      row << hit._source.dataset_name
      row << hit._score
      rmap << row*/


    }
     //rmap
     //println result.toPrettyString()
     //println rmap
  }else {
    []
  }



    
          
           

       


    


  





