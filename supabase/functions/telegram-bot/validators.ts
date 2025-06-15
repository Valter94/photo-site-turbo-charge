
export const validators = {
  isValidTitle: (title: string): boolean => {
    return title && title.trim().length >= 3 && title.trim().length <= 100
  },

  isValidDescription: (description: string): boolean => {
    return description && description.trim().length >= 10 && description.trim().length <= 500
  },

  isValidCategory: (category: string): boolean => {
    const validCategories = ['wedding', 'lovestory', 'portrait', 'family', 'corporate', 'maternity']
    return validCategories.includes(category)
  },

  isValidFileId: (fileId: string): boolean => {
    return fileId && fileId.length > 10 && fileId.match(/^[a-zA-Z0-9_-]+$/)
  },

  sanitizeText: (text: string): string => {
    return text.trim().replace(/[<>&"']/g, (match) => {
      const escapeMap: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;'
      }
      return escapeMap[match] || match
    })
  },

  validatePortfolioData: (data: any): { valid: boolean, errors: string[] } => {
    const errors: string[] = []
    
    if (!validators.isValidTitle(data.title)) {
      errors.push('Название должно быть от 3 до 100 символов')
    }
    
    if (!validators.isValidDescription(data.description)) {
      errors.push('Описание должно быть от 10 до 500 символов')
    }
    
    if (!validators.isValidCategory(data.category)) {
      errors.push('Неверная категория')
    }
    
    if (!validators.isValidFileId(data.photo_file_id)) {
      errors.push('Неверный ID фотографии')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  },

  validateLocationData: (data: any): { valid: boolean, errors: string[] } => {
    const errors: string[] = []
    
    if (!validators.isValidTitle(data.title)) {
      errors.push('Название локации должно быть от 3 до 100 символов')
    }
    
    if (!validators.isValidDescription(data.description)) {
      errors.push('Описание локации должно быть от 10 до 500 символов')
    }
    
    if (!validators.isValidFileId(data.photo_file_id)) {
      errors.push('Неверный ID фотографии')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
}
