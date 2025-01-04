import { Button, Card, Label, TextInput } from "flowbite-react";
import "./App.css";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { invoke } from "@tauri-apps/api/core";

type AuditParams = {
  url: string;
  seed: string;
}

function App() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      url: '',
      seed: '',
    },
  })

  const onSubmit: SubmitHandler<AuditParams> = (params) => {
    console.log(params);

    (async () => {
      const res = await invoke('audit', params)
      console.log(res)
    })()
  }

  return (
    <main>
      <form className="flex justify-center items-center h-screen bg-gray-100" onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Election Audit</h2>
          <div>
            <Label htmlFor="url" value="Election URL" />
            <Controller
              name="url"
              control={control}
              render={({ field }) => <TextInput
                id="url"
                type="text"
                required
                {...field}
              />} />
          </div>

          <div>
            <Label htmlFor="seed" value="Seed Phrase" />
            <Controller
              name="seed"
              control={control}
              render={({ field }) =>
                <TextInput
                  id="seed"
                  required
                  {...field}
                />} />
          </div>

          <Button type="submit">Verify Ballots and Show Results</Button>
        </Card>
      </form>
    </main>
  );
}

export default App;
