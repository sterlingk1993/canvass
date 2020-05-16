import glob from 'glob';
import fs from 'fs';

console.warn = function() {};
console.error = function() {};

// copy test files to run each of them as all platforms
['web','ios','android'].forEach(os => {
  glob
    .sync('../src/**/*.test.js', { cwd: `${__dirname}/` })
    .map(f => {
      let fn = f.replace('../', './');
      let nfn = fn.replace('.test.js','.'+os+'.test.js');
      let file = fs.readFileSync(`${fn}`).toString();
      fs.writeFileSync(`${nfn}`, file.replace(/###OS###/g, os));
      require(`../${nfn}`);
      fs.unlink(`./${nfn}`, () => {});
    });
});
