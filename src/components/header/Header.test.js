function sum(a,b) { return a+b}

test('first', ()=>{
   expect(sum(1,2)).toBeLessThan(5);
});