import inquirer from 'inquirer'
import 'colors'

const questions = [
  {
    type: 'list',
    name: 'optionMenu',
    message: '¿Qué desea hacer?',
    choices: [
      {
        value: '1',
        name: `${'1.'.cyan} Buscar ciudad`
      },
      {
        value: '2',
        name: `${'2.'.cyan} Historial de ciudades`
      },
      {
        value: '0',
        name: `${'0.'.red} Salir \n`
      }
    ]
  }
]

export const inquirerMenu = async () => {
  console.clear()
  console.log('======================'.green)
  console.log('Seleccione una opción'.green)
  console.log('======================\n'.green)

  const { optionMenu } = await inquirer.prompt(questions)

  return optionMenu
}

export const nextStep = async () => {
  const question = [{
    type: 'input',
    name: 'enter',
    message: `Presione ${'ENTER'.green} para continuar`
  }]
  await inquirer.prompt(question)
}

export const leerInput = async (message) => {
  const question = [
    {
      type: 'input',
      name: 'desc',
      message,
      validate (value) {
        if (value.length === 0) {
          return 'Por favor, ingrese un caracter'
        }
        return true
      }
    }
  ]
  console.clear()
  console.log('==================='.green)
  console.log('Buscador de ciudad'.green)
  console.log('===================\n'.green)
  const { desc } = await inquirer.prompt(question)
  return desc
}

export const listCities = async (ciudades = []) => {
  const choices = ciudades.map((ciudad, index) => {
    const idx = `${index + 1}.`.green
    return {
      value: ciudad.id,
      name: `${idx} ${ciudad.nombre}`
    }
  })
  choices.unshift({
    value: '0',
    name: '0.'.red + ' Cancelar'
  })

  const question = [
    {
      type: 'list',
      name: 'cityList',
      message: '¿Que ciudad quiere seleccionar?',
      choices
    }
  ]

  console.clear()
  console.log('======================'.yellow)
  console.log('Seleccione una opcion'.yellow)
  console.log('======================\n'.yellow)

  const { cityList } = await inquirer.prompt(question)

  return cityList
}

export const confirmAction = async (message) => {
  const question = [
    {
      type: 'confirm',
      name: 'ok',
      message
    }
  ]

  const { ok } = await inquirer.prompt(question)
  return ok
}

export const checkList = async (tasks = []) => {
  const choices = tasks.map((task) => {
    return {
      value: task.id,
      name: ` ${task.desc}`,
      checked: !!(task.completadoEn)
    }
  })
  const question = [
    {
      type: 'checkbox',
      name: 'checklist',
      message: 'Seleccione lo que quiere',
      choices
    }
  ]
  console.log('=============================='.green)
  console.log('Marque o desmarque sus tareas'.green)
  console.log('==============================\n'.green)
  const { checklist } = await inquirer.prompt(question)
  return checklist
}
