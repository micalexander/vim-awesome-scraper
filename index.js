const axios = require('axios')
const fs = require('fs')

//command cat plugins.txt | fzf -m | awk '{print $4"/"$1}' | sed -E "s/(.*)/dein#add('\1')/g" | pbcopy

let currentPage = 1
let pageCount = 1
let totalResults = 1
let allPlugins = []
const getPlugins = async (p) => {

  return await axios.get(`https://vimawesome.com/api/plugins?page=${p}`)
    .then(({data}) => {
      pageCount = data.total_pages
      totalResults = data.total_results
      return data.plugins
    })
    .then(data => {
      let pluginPage = []
      data.forEach(plugin => {
        if (plugin.github_owner) {
          allPlugins.push(`${plugin.github_repo_name.padEnd(25)}${plugin.github_stars.toString().padStart(9).padEnd(10)}${'stars'.padEnd(10)}${plugin.github_owner.padEnd(15)}${plugin.short_desc}`)
          pluginPage.push(plugin.github_repo_name)
        }
      })
      console.log('\n')
      console.log('Plugins Captured:')
      console.log(pluginPage.join(' '))
      console.log('\n')
    })
    .catch(error => console.log(error))

}
const plugins = (p) => {
  getPlugins(p)
    .then(data => {
      console.log(`${'Current Page'.padEnd(18)}${'Total Pages'.padEnd(16)}${'Total Plugins'.padEnd(18)}${'Total Results'.padEnd(18)}`)
      if (currentPage < pageCount) {
        console.log(`${p.toString().padStart(6).padEnd(22)}${pageCount.toString().padEnd(16)}${allPlugins.length.toString().padEnd(18)}${totalResults.toString().padEnd(10)}`)
        currentPage = p + 1
        plugins(currentPage)
      }
      else {
        fs.writeFile('./plugins.txt', allPlugins.join(' \n'), 'ascii', (err) => {
          if (err) throw err
          console.log('file saved!')
        })

      }

    })
}

plugins(1)

