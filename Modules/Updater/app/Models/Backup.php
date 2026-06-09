<?php

namespace Modules\Updater\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Updater\Database\Factories\BackupFactory;

class Backup extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'backup_name',
        'source_code_zip',
        'database_zip',
        'source_code_size',
        'database_size',
        'status',
        'notes',
    ];

    // protected static function newFactory(): BackupFactory
    // {
    //     // return BackupFactory::new();
    // }
}
