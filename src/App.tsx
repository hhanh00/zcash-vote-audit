import { Button, Card, Label, Spinner, TextInput } from "flowbite-react";
import "./App.css";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { invoke } from "@tauri-apps/api/core";
import { EChart } from "@kbox-labs/react-echarts";
import { useState } from "react";
import Swal from "sweetalert2";

type AuditParams = {
  url: string;
  seed: string;
}

type Count = {
  choice: string;
  amount: number;
}

function App() {
  const [validating, setValidating] = useState(false)
  const [results, setResults] = useState<Count[]>([])
  const { control, handleSubmit } = useForm({
    defaultValues: {
      url: '',
      seed: '',
    },
  })

  const onSubmit: SubmitHandler<AuditParams> = (params) => {
    console.log(params);

    (async () => {
      try {
        setValidating(true)
        const res: Count[] = await invoke('audit', params)
        console.log(res)
        setResults(res)
      }
      catch (e: any) {
        await Swal.fire(
          {
            icon: "error",
            title: e
          })
      }
      finally {
        setValidating(false)
      }
    })()
  }

  const labels = results.map((c) => c.choice)
  const votes = results.map((c) => c.amount / 100000)

  return (
    <main>
      {validating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spinner color="info" size="xl" />
        </div>
      )}

      {results.length == 0 && <form className="flex justify-center items-center bg-gray-100" onSubmit={handleSubmit(onSubmit)}>
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
      </form>}
      <EChart
        renderer={'svg'}
        onClick={() => console.log('clicked!')}
        style={{
          height: '600px',
          width: '100%'
        }}
        xAxis={{
          type: 'category',
          data: labels
        }}
        yAxis={{
          type: 'value'
        }}
        series={[
          {
            data: votes,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },
            label: {
              show: true,
              position: 'inside'
            }
          }
        ]}
      />
    </main>
  );
}

export default App;
