// icons.js - Optimized for tree-shaking
import { library } from '@fortawesome/fontawesome-svg-core'

// Define icon map for different notification types
export const notificationIcons = {
  success: () => import('@fortawesome/free-solid-svg-icons/faCheck'),
  warning: () => import('@fortawesome/free-solid-svg-icons/faExclamationTriangle'),
  error: () => import('@fortawesome/free-solid-svg-icons/faExclamationCircle'),
  info: () => import('@fortawesome/free-solid-svg-icons/faInfoCircle')
}

/**
 * Dynamically registers FontAwesome icons with the library.
 * This function uses code-splitting and lazy loading to optimize bundle size.
 * 
 * @param {string[]} types - Array of icon types to load ('success', 'error', etc.)
 * @returns {Promise<boolean>} - Resolves to true when icons are registered
 * 
 * @example
 * // Load single icon
 * await registerIcons(['success'])
 * 
 * // Load multiple icons
 * await registerIcons(['success', 'error', 'warning'])
 */
export const registerIcons = async (types = ['success']) => {
  // Step 1: Convert icon types to dynamic imports
  const icons = await Promise.all(
    types.map(type => 
      // Optional chaining (?.) handles cases where type doesn't exist
      // notificationIcons[type] gets the import function
      // () calls the import function to start loading
      notificationIcons[type]?.()
    )
  )

  // Step 2: Process and register the loaded icons
  library.add(
    ...icons
      // Transform the loaded modules to get their default exports
      .map(icon => icon?.default)  // Optional chaining for null safety
      // Remove any null/undefined values from failed loads
      .filter(Boolean)
  )

  // Step 3: Confirm registration complete
  return true
}