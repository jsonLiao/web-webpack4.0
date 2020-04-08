import './../css/index.scss';

console.log('index page ...');

show("99999");

function show(data) {
  console.log(data)
}

const fn = () => {
  console.log('json hello');
}

fn();

console.log('aaa'.includes('a'))


function Person() {
  this.name = 'json Liao',
  this.age = 18
  setTimeout(() => {
    console.log('my name is ' + this.name + ', this year, I ' + this.age + '岁')
  }, 1000)
}

let p = new Person()


