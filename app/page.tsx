import DatabaseSchemaForm from "./_components/form";

export default function Home() {
  return (
    <main className="w-full md:w-2/3 mx-auto">
      <div className="text-center my-4">
        <h2 className="my-4 text-3xl font-bold">TSUKURUN</h2>
        <h3 className="my-4 text-md">
          データベースのテーブル定義を入力するとダミーデータを作ります
        </h3>
      </div>
      <DatabaseSchemaForm />
    </main>
  );
}
