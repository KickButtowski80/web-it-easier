// icons.js - Direct imports for better reliability
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faInfoCircle, 
  faCheck, 
  faExclamation, 
  faExclamationCircle 
} from '@fortawesome/free-solid-svg-icons'

// Add all icons to the library directly
library.add(
  faInfoCircle,
  faCheck,
  faExclamation,
  faExclamationCircle
)

// Map notification types to icon names
export const notificationIcons = {
  info: faInfoCircle,
  success: faCheck,
  warning: faExclamation,
  error: faExclamationCircle
}

