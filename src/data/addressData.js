// Minimal mock hierarchical address data for Bihar used by cascading selectors.
// Replace with real API data when available.

const addressData = {
  
  Patna: {
    blocks: {
      'Patna Sadar': {
        panchayats: {
          'Panchayat A': {
            villages: {
              'Village 1': { wards: ['Ward 1', 'Ward 2'] },
              'Village 2': { wards: ['Ward 3'] },
            },
          },
          'Panchayat B': {
            villages: {
              'Village 3': { wards: ['Ward 4', 'Ward 5'] },
            },
          },
        },
      },
      'Rupaspur': {
        panchayats: {
          'Panchayat C': {
            villages: {
              'Village 4': { wards: ['Ward 6'] },
            },
          },
        },
      },
    },
  },
  Gaya: {
    blocks: {
      'Gaya Sadar': {
        panchayats: {
          'Panchayat X': {
            villages: {
              'Village A': { wards: ['Ward 1'] },
            },
          },
        },
      },
    },
  },
}

export default addressData
