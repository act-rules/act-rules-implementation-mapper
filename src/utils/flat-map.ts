export function flatMap(arr: any[]): any[] {
	return arr.reduce((out, current) => out.concat(current), [])
}
