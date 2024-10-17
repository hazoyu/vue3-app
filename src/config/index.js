
//获取当前环境模式，并在环境模式未定义时提供一个默认值 
// import.meta.env.MODE默认情况=development
<<<<<<< HEAD
// const env = import.meta.env.MODE || "prod"
const env ="development"
=======
const env = import.meta.env.MODE || "prod"
>>>>>>> 170c15f46673059fdab29472182b168ade4ca3a3
const EnvConfig ={
  development:{ //开发环境
    baseApi:'/',
    mockApi:'https://apifoxmock.com/m1/4068509-0-default/api',
  },
  test:{ //测试环境
    baseApi:'//test.future.com/api',
    mockApi:'https://apifoxmock.com/m1/4068509-0-default/api',
  },
  prod:{ //线上环境
    baseApi:'//future.com/api',
    mockApi:'https://apifoxmock.com/m1/4068509-0-default/api',
  }
}
export default{
  env,
  ...EnvConfig[env],
  //mock
  mock:false,
}