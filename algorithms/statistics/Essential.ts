const avg = (nums: number[]) => {
    return nums.reduce((acc, curr) => acc + curr) / nums.length;
}

const std = (nums: number[]) => {
    return Math.sqrt(nums.map(x => Math.pow(x - avg(nums), 2)).reduce((a, b) => a + b) / nums.length);
}

export { avg, std };