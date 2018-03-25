
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


//url = 'http://ontolinator.kaust.edu.sa:9200/'
url = 'http://10.254.145.46:9200/'
http = new HTTPBuilder(url)

println new JsonBuilder(search(q))

def search(def id) {

  def fres = ""
  def fres2 = null
  def query = """
 {
    "suggest": {
        "entity" : {
            "prefix" : "$id", 
            "completion" : { 
                "field" : "name"
            }
        }
    },
    "size":10
}"""


//println query
  def jsonSlurper = new JsonSlurper()
  def js = new JsonBuilder(jsonSlurper.parseText(query))
  def t
  //println js
  http.post( path: '/bio2vec/_search', requestContentType : JSON, body: js.toString() ) { resp, reader -> t = reader }
  //println t.suggest.entity.options.text
  //return t
  //.suggest.entity.options
  http.shutdown()
    def rmap = []
    t.suggest.entity.options.each { hit ->

      hit.each { op ->
        def row = []
      //row<<hit
      //def rid = hit._source.id
      row << op.text
      //row << op._source.name
      row << op._source.id
      row << op._source.dataset_name
      row<<op._id
      row<<op._source['@model_factor']

      rmap << row
      }
      //def row = []
      //row<<hit
      //def rid = hit._source.id
      /*row << hit.text
      row << hit._source.id
      row << hit._source.dataset_name
      row<<hit._id*/
      //row << hit._score
      //row<< hit.options._id
      
    }
    rmap
}
