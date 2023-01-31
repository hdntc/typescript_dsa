/**
 * @param nums The numbers to compute the average of.
 * @returns The average or mean.
 */
const avg = (nums: number[]) => {
    if(!nums.length) return 0;
    return nums.reduce((acc, curr) => acc + curr) / nums.length;
}

/**
 * @param nums The numbers to compute the standard deviation of.
 * @param sample Whether to regard `nums` as a sample or as a population. 
 * - If `true`, computes the sample std (commonly denoted as *s*). 
 * - If `false`, computes population std (commonly denoted as *σ*).
 * - `false` by default.
 * @returns The standard deviation.
 */
const std = (nums: number[], sample: boolean=false) => {
    if(nums.length < 2) return 0;
    return Math.sqrt(vnc(nums, sample));
}

/**
 * @param nums The numbers to compute the variance of.
 * @param sample Whether to regard `nums` as a sample or as a population. 
 * - If `true`, computes the sample variance (commonly denoted as *s^2*). 
 * - If `false`, computes population variance (commonly denoted as *σ^2*).
 * - `false` by default.
 * @returns The variance.
 */
const vnc = (nums: number[], sample: boolean=false) => {
    if(nums.length < 2) return 0;
    return nums.map(x => Math.pow(x - avg(nums), 2)).reduce((a, b) => a + b) / (nums.length - +sample);
}

export { avg, std, vnc };