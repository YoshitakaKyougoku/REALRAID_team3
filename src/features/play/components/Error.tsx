import Link from "next/link";

export default function Error({ error }: { error: string }) {
  return (
    <div>
      <div className="text-red-500">{error}</div>
      <Link href="/">ホームへ戻る</Link>
    </div>
  );
}
