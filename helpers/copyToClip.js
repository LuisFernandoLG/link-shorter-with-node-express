const copyToClip = ({content})=>{
  navigator.clipboard.writeText(content).then(()=>{
    console.log("Copiado!")
  })
  .catch(()=>{
    console.log("No copied!")
  })
}

module.exports = copyToClip