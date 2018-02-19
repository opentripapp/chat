/**
 * Created by muharizals on 04/10/2017.
 */

import Cookies from 'js-cookie'

export default function ({store,redirect,route}) {
  let isAuthenticated = Cookies.get('token');
  if(route.name === 'index'){
    if (!isAuthenticated) {
      redirect('/login')
    }
  }else if(route.name === 'login' ){
    if (isAuthenticated) {
      redirect('/')
    }
  }
}
