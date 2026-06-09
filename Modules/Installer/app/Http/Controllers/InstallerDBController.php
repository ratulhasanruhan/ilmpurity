<?php

namespace Modules\Installer\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PDO;
use PDOException;

class InstallerDBController extends Controller
{
    protected $mydb;

    public function databaseChecker(Request $request)
    {
        session()->put('DB_CONNECTION', $request->db_connection);
        session()->put('DB_HOST', $request->db_host);
        session()->put('DB_PORT', $request->db_port);
        session()->put('DB_DATABASE', $request->db_database);
        session()->put('DB_USERNAME', $request->db_username);
        session()->put('DB_PASSWORD', $request->db_password);

        if ($request->db_connection == 'mysql') {
            return $this->mysqlChecker();
        }

        return back()->with('error', 'DB Type not Supported for testing');

    }

    public function mysqlChecker()
    {
        $db_type = session('DB_CONNECTION');
        $db_host = session('DB_HOST');
        $db_name = session('DB_DATABASE');
        $db_user = session('DB_USERNAME');
        $db_pass = session('DB_PASSWORD');
        $db_port = session('DB_PORT');

        if (!$db_host) {
            return back()->with('error', 'No Host');
        }

        if (!$db_name) {
            return back()->with('error', 'No database name');
        }

        if (!$db_user) {
            return back()->with('error', 'No user');
        }

        if (!$db_port) {
            return back()->with('error', 'No port');
        }

        try {
            $db = new PDO($db_type . ':host=' . $db_host . ';port=' . $db_port . ';dbname=' . $db_name, $db_user, $db_pass, array(
                PDO::ATTR_TIMEOUT => '5', PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::MYSQL_ATTR_LOCAL_INFILE => true,
            ));
        } catch (PDOException $e) {
            if ($e->getCode() == '1049' && !$db_name == '') {
                try {
                    $db = new PDO($db_type . ':host=' . $db_host . ';port=' . $db_port . ';dbname=' . '', $db_user, $db_pass, array(
                        PDO::ATTR_TIMEOUT => '5', PDO::ATTR_EMULATE_PREPARES => false,
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::MYSQL_ATTR_LOCAL_INFILE => true,
                    ));
                    $db->query("CREATE DATABASE IF NOT EXISTS $db_name");

                    session()->put('db_connection', true);

                    return redirect(route('install.show-step3', ['connection_status' => true]))->with('success', 'Database ' . $db_name . ' created');
                } catch (\Throwable $th) {

                    return back()->with('error', "Failed to connect to your database.");
                }
            }

            return back()->with('error', $e->getMessage());
        }

        session()->put('db_connection', true);

        return redirect(route('install.show-step3', ['connection_status' => true]))->with('success', 'Seems okay');
    }
}
