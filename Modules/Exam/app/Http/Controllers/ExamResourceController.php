<?php

namespace Modules\Exam\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ChunkedUpload;
use Modules\Exam\Http\Requests\ExamResourceRequest;
use Modules\Exam\Models\ExamResource;
use Modules\Exam\Services\ExamResourceService;

class ExamResourceController extends Controller
{
    public function __construct(private ExamResourceService $examResource) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(ExamResourceRequest $request)
    {
        $this->examResource->resourceStore($request->validated());

        return back()->with('success', 'Resource created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ExamResourceRequest $request, string $id)
    {
        $lessonResource = ExamResource::findOrFail($id);

        $this->examResource->resourceUpdate($lessonResource, $request->validated());

        return back()->with('success', 'Resource updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $lessonResource = ExamResource::findOrFail($id);

        $this->examResource->resourceDelete($lessonResource);

        return back()->with('success', 'Resource deleted successfully');
    }

    /**
     * Download the specified resource.
     */
    public function download(string $id)
    {
        $lessonResource = ExamResource::findOrFail($id);
        $resourceUrl = $lessonResource->resource;
        $chunkedUpload = ChunkedUpload::where('file_url', $resourceUrl)->first();
        $mimeType = $chunkedUpload->mime_type;
        $extension = pathinfo($chunkedUpload->original_filename, PATHINFO_EXTENSION);
        $filename = $lessonResource->title ? $lessonResource->title . '.' . $extension : $chunkedUpload->filename;

        return response()->streamDownload(
            function () use ($resourceUrl) {
                echo file_get_contents($resourceUrl);
            },
            $filename,
            [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'attachment; filename="' . $filename . '"'
            ]
        );
    }
}
