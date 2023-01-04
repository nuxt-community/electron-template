const path = require('path')
const Config = require(path.join(__dirname,'./nuxt.config'))
const { Nuxt, Builder } = require('nuxt')
const isDev = process.env.NODE_ENV === 'DEV'

class NuxtService {
  constructor () {
    const config = {...Config, ...{dev: isDev}, ...{rootDir: __dirname}}
    this.nuxt = new Nuxt(config)
  }

  /**
   * Starts the build process
   *
   * @method boot
   *
   * @return {Promise}
   */
  build () {
    return new Builder(this.nuxt).build()
  }

  /**
   * Handles the HTTP request by making the appropriate
   * response, based upon the URL.
   *
   * @method render
   *
   * @param  {Object} req
   * @param  {Object} res
   *
   * @return {Promise}
   */
	render (req, res) {
      return this.nuxt.render(req, res)
  }

  /**
   * Runs the Callback on Nuxt ready hook
   *
   * @method render
   *
   * @param  {Function} callback
   *
   * @return {void}
   */

  whenReady(callback)
  {
    this.nuxt.ready().then(callback)
  }

}

let nuxt = new NuxtService()
const http = require('http')

const server = http.createServer((req, res)=>{
	return nuxt.render(req, res)
})

server.listen()

if(isDev)
{
  nuxt.build().then(()=>{
    process.send({
        status:'done',
        port:server.address().port
    })
  })
} else
{
  nuxt.whenReady(()=>process.send({
    status:'done',
    port:server.address().port
  }))
}


