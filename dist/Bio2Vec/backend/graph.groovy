
@Grab(group='org.codehaus.groovy.modules.http-builder', module='http-builder', version='0.7.1' )

import groovyx.net.http.HTTPBuilder
import groovy.json.*
import java.net.*
import static groovyx.net.http.Method.GET
import static groovyx.net.http.Method.POST
import static groovyx.net.http.ContentType.*

if(!application) {
  application = request.getApplication(true)
}

response.contentType = 'application/json'
def q = params.term
def searchafter=params.sa

//println "hello"
//url = 'http://ontolinator.kaust.edu.sa:9200/'
url = 'http://10.254.145.46:9200/'
http = new HTTPBuilder(url)

println new JsonBuilder(search(q,searchafter))

def search(def dataset,def searchafter) {

  def fres = ""
  def fres2 = null
  def query
if(searchafter){

   query = """
{
   "_source": ["pca_x","pca_y","name","id","entity_type"],
   "query":{
      "match": { "dataset_name" : "$dataset" }
    },
   "size":10000,
   "sort": [{"id": "desc"}],
   "search_after": ["$searchafter"],
   "sort": [{"id": "desc"}],

}"""
}
else{
   query = """
{
   "_source": ["pca_x","pca_y","name","id","entity_type"],
   "query":{
      "match": { "dataset_name" : "$dataset" }
    },
   "size":10000,
   "sort": [{"id": "desc"}]


}"""
}

//println query
  def jsonSlurper = new JsonSlurper()
  def js = new JsonBuilder(jsonSlurper.parseText(query))
  def t
  //println js
  http.post( path: '/bio2vec/_search', requestContentType : JSON, body: js.toString() ) { resp, reader -> t = reader }
  return t.hits.hits
}
