const CATEGORY_SUBCATEGORY_MAP = {
  "Graceful Abayas": "Abaya",
  "Ethnic Elegance": "Pakistani Wear",
  Jalabiya: "Jalabiya",
  "Intimate Collection": "Intimate Wear",
  "Stitching Services": "Stitching Service",
}

const normalizeLabel = (value) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''

export const deriveGeneralCategory = (category, subCategory) => {
  const normalizedCategory = normalizeLabel(category)
  const normalizedSubCategory = normalizeLabel(subCategory)

  if (normalizedSubCategory) {
    return normalizedSubCategory
  }

  if (!normalizedCategory) {
    return ''
  }

  if (CATEGORY_SUBCATEGORY_MAP[normalizedCategory]) {
    return CATEGORY_SUBCATEGORY_MAP[normalizedCategory]
  }

  const lowerCategory = normalizedCategory.toLowerCase()

  if (lowerCategory.includes('abaya')) {
    return 'Abaya'
  }

  if (lowerCategory.includes('ethnic') || lowerCategory.includes('pakistani')) {
    return 'Pakistani Wear'
  }

  if (lowerCategory.includes('jalabiya')) {
    return 'Jalabiya'
  }

  if (lowerCategory.includes('intimate')) {
    return 'Intimate Wear'
  }

  if (lowerCategory.includes('stitching')) {
    return 'Stitching Service'
  }

  return normalizedCategory
}
