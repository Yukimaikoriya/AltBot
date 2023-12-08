const { exec } = require('child_process') // Use exec sync?

const pythonScript = 'ML_Model.py'
const args = ['Hello_World', 3]
const command = `python ${pythonScript} ${args.join(' ')}`

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing Python script: ${error.message}`)
    return
  }

  console.log(`Python script output: ${stdout}`)
})
