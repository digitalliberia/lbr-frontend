// Route guard to redirect users based on role
export const getPortalRedirect = (userType) => {
  switch(userType) {
    case 'applicant':
      return '/register/name-reservation';
    case 'owner':
      return '/owner';
    case 'lbr_officer':
      return '/lbr';
    case 'lra_officer':
      return '/lra';
    case 'admin':
      return '/admin';
    default:
      return '/';
  }
};

// Portal access mapping
export const portalAccess = {
  '/owner': ['owner', 'admin'],
  '/lbr': ['lbr_officer', 'admin'],
  '/lra': ['lra_officer', 'admin'],
  '/admin': ['admin'],
  '/register': ['applicant', 'owner'],
  '/': ['public']
};
